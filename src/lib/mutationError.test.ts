import { describe, it, expect } from "vitest"
import axios from "axios"
import { getMutationErrorMessage } from "./mutationError"

describe("getMutationErrorMessage", () => {
  it("returns API error string when axios error has data.error", () => {
    const err = new axios.AxiosError("msg", "ERR", undefined, undefined, {
      status: 400,
      data: { error: "  bad request  " },
    } as never)
    expect(getMutationErrorMessage(err)).toBe("  bad request  ")
  })

  it("returns status message when axios has status but no error string", () => {
    const err = new axios.AxiosError("fail", "ERR", undefined, undefined, {
      status: 502,
      data: {},
    } as never)
    expect(getMutationErrorMessage(err)).toBe("Request failed (502)")
  })

  it("returns axios message when no status", () => {
    const err = new axios.AxiosError("network down", "ERR_NETWORK")
    expect(getMutationErrorMessage(err)).toBe("network down")
  })

  it("returns generic when axios message empty", () => {
    const err = new axios.AxiosError("", "ERR")
    expect(getMutationErrorMessage(err)).toBe("Request failed")
  })

  it("returns Error message for non-axios Error", () => {
    expect(getMutationErrorMessage(new Error("oops"))).toBe("oops")
  })

  it("returns generic for Error with blank message", () => {
    expect(getMutationErrorMessage(new Error("   "))).toBe("Something went wrong")
  })

  it("returns generic for unknown values", () => {
    expect(getMutationErrorMessage(null)).toBe("Something went wrong")
    expect(getMutationErrorMessage({ foo: 1 })).toBe("Something went wrong")
  })
})
