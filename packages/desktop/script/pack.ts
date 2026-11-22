#!/usr/bin/env bun
import { $ } from "bun"
import { cp, mkdir, readdir, rm } from "node:fs/promises"
import path from "node:path"
import { getConfig } from "../electron-builder.config"
import { portableMarker } from "../src/main/lifecycle/portable"
import { getCurrentCli, resolveChannel, windowsInstallerName } from "./utils"

// Packages the built app (out/) for OPENCODE_TARGET into dist/desktop at the repository root, unsigned:
// macOS: the .app as a tarball. Windows: the unpacked app in app/, or with OPENCODE_DESKTOP_APP, the Inno Setup
// installer around that (signed) app. Linux: AppImage, deb and rpm. The release workflow signs afterwards.
const dir = path.resolve(import.meta.dir, "..")

const out = path.resolve(dir, "../../dist/desktop")

const cli = getCurrentCli()

const os =
  new Map([
    ["darwin", "mac"],
    ["win32", "win"],
  ]).get(cli.os) ?? "linux"

const app = process.env.OPENCODE_DESKTOP_APP
const portable = process.argv.includes("--portable")
const portableOutput = path.resolve(dir, `../../dist/portable/AccessCode-${cli.target}`)

const flags = [`--${os}`, `--${cli.cpu}`, "--publish", "never", "--config", "electron-builder.config.ts"]

process.chdir(dir)

if (portable) {
  if (os !== "win" || process.platform !== "win32" || app)
    throw new Error("Portable packaging requires a Windows build host and an unpacked Windows target")
  await mkdir(path.dirname(portableOutput), { recursive: true })
  // Never replace a portable folder: it may already hold the user's profile.
  await mkdir(portableOutput)
  await $`bunx electron-builder ${flags} --dir --config.directories.output=dist/portable`
  const unpacked = path.join("dist", "portable", cli.cpu === "arm64" ? "win-arm64-unpacked" : "win-unpacked")
  await cp(unpacked, portableOutput, { recursive: true })
  await Bun.write(path.join(portableOutput, portableMarker), "")
  console.log(`Portable app is in ${portableOutput}`)
  process.exit(0)
}

await rm("dist", { recursive: true, force: true })
await rm(out, { recursive: true, force: true })

await mkdir(out, { recursive: true })

if (app) {
  if (os !== "win" || process.platform !== "win32") throw new Error("Inno Setup requires a Windows build host")

  const iscc = process.env.ISCC ?? Bun.which("ISCC.exe")
  if (!iscc) throw new Error("Install Inno Setup and add ISCC.exe to PATH, or set ISCC to its absolute path")
  await $`bun ./script/copy-icons.ts ${resolveChannel()}`
  const config = getConfig()
  const version = process.env.OPENCODE_VERSION ?? (await Bun.file("package.json").json()).version
  const architecture = cli.cpu === "arm64" ? "arm64" : "x64compatible"
  const payload = path.resolve(app)
  const executable = path.join(payload, `${config.productName}.exe`)
  if (!(await Bun.file(executable).exists())) throw new Error(`Missing packaged application: ${executable}`)
  if (!(await Bun.file(path.join(payload, "resources", "opencode-cli.exe")).exists()))
    throw new Error(`Missing bundled Windows CLI in ${payload}`)

  await $`${iscc} ${[
    `/O${out}`,
    `/DAccessCodeAppId=${config.appId}`,
    `/DAccessCodeProduct=${config.productName}`,
    `/DAccessCodeVersion=${version}`,
    `/DAccessCodeArchitecture=${architecture}`,
    `/DAccessCodePayload=${payload}`,
    `/DAccessCodeInstaller=${path.parse(windowsInstallerName(cli.cpu)).name}`,
    path.join(dir, "resources", "windows", "installer.iss"),
  ]}`
}

if (!app && os === "linux") {
  await $`bunx electron-builder ${flags}`
  const files = (await readdir("dist")).filter((file) => /\.(AppImage|deb|rpm)$/.test(file))
  await Promise.all(files.map((file) => cp(path.join("dist", file), path.join(out, file))))
}

if (!app && os === "mac") {
  await $`bunx electron-builder ${flags} --dir -c.mac.identity=null`
  const parent = path.join("dist", cli.cpu === "arm64" ? "mac-arm64" : "mac")
  const bundles = (await readdir(parent)).filter((file) => file.endsWith(".app"))

  if (bundles.length !== 1) throw new Error(`Expected one .app bundle in ${parent}, found ${bundles.join(", ")}`)
  if (process.env.SPARKLE_DISTRIBUTION)
    await $`bash sparkle/embed.sh ${path.join(parent, bundles[0])} ${process.env.SPARKLE_DISTRIBUTION}`

  await writeUpdateConfig(path.join(parent, bundles[0], "Contents", "Resources"))
  await $`tar -cf ${path.join(out, `opencode-desktop-mac-${cli.cpu}.app.tar`)} -C ${parent} ${bundles[0]}`
}

if (!app && os === "win") {
  await $`bunx electron-builder ${flags} --dir`
  const unpacked = path.join("dist", cli.cpu === "arm64" ? "win-arm64-unpacked" : "win-unpacked")
  const publisher = process.env.ACCESSCODE_WINDOWS_UPDATE_PUBLISHER?.trim()
  if (publisher) {
    const config = getConfig().publish
    // JSON is also valid YAML. The updater plugin uses this file to opt signed builds in.
    await Bun.write(
      path.join(unpacked, "resources", "accesscode-update.json"),
      JSON.stringify({
        ...config,
        publisherName: [publisher],
        updaterCacheDirName: `${getConfig().appId}-updater`,
      }),
    )
  }
  await cp(unpacked, path.join(out, "app"), { recursive: true })
}

// electron-builder doesn't write resources/app-update.yml for --dir builds.
async function writeUpdateConfig(resources: string) {
  const publish = getConfig().publish
  const name: string = (await Bun.file("package.json").json()).name
  await Bun.write(
    path.join(resources, "app-update.yml"),
    [
      `provider: ${publish.provider}`,
      `url: ${publish.url}`,
      `channel: ${publish.channel}`,
      `updaterCacheDirName: '${name.replace(/[/\\:*?"<>|]/g, "").toLowerCase()}-updater'`,
    ].join("\n") + "\n",
  )
}
