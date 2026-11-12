import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateProfile } from "./updateProfile";

const { from, query } = vi.hoisted(() => ({
    from: vi.fn(),
    query: { update: vi.fn(), eq: vi.fn(), select: vi.fn(), single: vi.fn() },
}));

vi.mock("../../../lib/supabase/client", () => ({ supabase: { from } }));

beforeEach(() => {
    vi.clearAllMocks();
    from.mockReturnValue(query);
    query.update.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.select.mockReturnValue(query);
});

describe("updateProfile", () => {
    const input = { display_name: "Member", first_name: "First", last_name: "Last" };

    it("updates only the requested user's editable fields and returns the saved row", async () => {
        const profile = { id: "user-1", ...input, is_admin: false, image_path: "existing.png" };
        query.single.mockResolvedValueOnce({ data: profile, error: null });
        expect(await updateProfile("user-1", input)).toEqual(profile);
        expect(from).toHaveBeenCalledWith("profiles");
        expect(query.update).toHaveBeenCalledWith(input);
        expect(query.eq).toHaveBeenCalledWith("id", "user-1");
        expect(query.select).toHaveBeenCalledWith("*");
        expect(query.single).toHaveBeenCalledOnce();
    });

    it("allows clearing names and saving the image in the same update", async () => {
        const cleared = { display_name: null, first_name: null, last_name: null, image_path: null };
        query.single.mockResolvedValueOnce({ data: { id: "user-1", ...cleared }, error: null });
        await updateProfile("user-1", cleared);
        expect(query.update).toHaveBeenCalledWith(cleared);
    });

    it("does not pass through administrative or identity fields", async () => {
        query.single.mockResolvedValueOnce({ data: input, error: null });
        const untrustedInput = { ...input, is_admin: true, id: "someone-else" };
        await updateProfile("user-1", untrustedInput);
        expect(query.update).toHaveBeenCalledWith(input);
    });

    it.each(["Permission denied", "No row returned"])("throws on %s", async (message) => {
        const error = new Error(message);
        query.single.mockResolvedValueOnce({ data: null, error });
        await expect(updateProfile("user-1", input)).rejects.toBe(error);
    });
});
