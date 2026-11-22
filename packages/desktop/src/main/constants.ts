import { app } from "electron"
import { betaName } from "../shared/beta-name"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.OPENCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

const appNames: Record<string, string> = {
  dev: "AccessCode Dev",
  beta: betaName(process.platform),
  prod: "AccessCode",
}

const appIDs: Record<string, string> = {
  dev: "app.techopolis.accesscode.dev",
  beta: "app.techopolis.accesscode.beta",
  prod: "app.techopolis.accesscode",
}

// Local renderer/server mode keeps the dev application identity.
export const APP_NAME = app.isPackaged ? appNames[CHANNEL] : "AccessCode Dev"

export const APP_ID = app.isPackaged ? appIDs[CHANNEL] : "app.techopolis.accesscode.dev"
