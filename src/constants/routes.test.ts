import { describe, it, expect } from "vitest"
import {
  ROUTES,
  floraPath,
  floraDetailsPath,
  profilePath,
  profileFollowersPath,
  profileFollowingPath,
  greenhouseWithAuthorQuery,
  laboratoryFullFromGrow,
} from "./routes"

describe("routes helpers", () => {
  it("floraPath encodes id", () => {
    expect(floraPath("ab/c")).toBe(`${ROUTES.FLORA}/ab%2Fc`)
  })

  it("floraDetailsPath encodes id", () => {
    expect(floraDetailsPath("x")).toBe(`${ROUTES.FLORA}/x/details`)
  })

  it("profilePath strips leading @", () => {
    expect(profilePath("@user")).toBe(`${ROUTES.PROFILE}/user`)
    expect(profilePath("user")).toBe(`${ROUTES.PROFILE}/user`)
  })

  it("profileFollowersPath and profileFollowingPath extend profile", () => {
    expect(profileFollowersPath("u")).toBe(`${ROUTES.PROFILE}/u/followers`)
    expect(profileFollowingPath("u")).toBe(`${ROUTES.PROFILE}/u/following`)
  })

  it("greenhouseWithAuthorQuery builds search params", () => {
    expect(greenhouseWithAuthorQuery("id1")).toBe(
      `${ROUTES.GREENHOUSE}?authorId=id1`
    )
    expect(greenhouseWithAuthorQuery("id1", "n")).toBe(
      `${ROUTES.GREENHOUSE}?authorId=id1&username=n`
    )
  })

  it("laboratoryFullFromGrow returns full lab path", () => {
    expect(laboratoryFullFromGrow()).toBe(
      `${ROUTES.LABORATORY_FULL}?from=grow`
    )
  })
})
