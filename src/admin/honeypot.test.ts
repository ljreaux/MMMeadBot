import { describe, expect, it, mock } from "bun:test";
import { Collection, PermissionFlagsBits } from "discord.js";
import { handleHoneypotMessage } from "./honeypot";

const makeFixture = ({
  channelId = "honeypot-channel",
  webhookId = null,
  bannable = true,
  protectedMember = false,
}: {
  channelId?: string;
  webhookId?: string | null;
  bannable?: boolean;
  protectedMember?: boolean;
} = {}) => {
  const ban = mock(async () => undefined);
  const send = mock(async (_payload: unknown) => undefined);
  const fetchChannel = mock(async () => ({
    isTextBased: () => true,
    send,
  }));
  const roles = new Collection<string, any>();
  roles.set("guild-id", {
    id: "guild-id",
    name: "@everyone",
    position: 0,
  });
  roles.set("member-role", {
    id: "member-role",
    name: "Member",
    position: 1,
  });

  const member = {
    id: "user-id",
    displayName: "Display Name",
    joinedTimestamp: Date.UTC(2026, 0, 1),
    bannable,
    ban,
    permissions: {
      has: (permission: bigint) =>
        protectedMember && permission === PermissionFlagsBits.Administrator,
    },
    roles: { cache: roles },
    guild: { id: "guild-id" },
  };

  const message = {
    id: "message-id",
    channelId,
    guildId: "guild-id",
    webhookId,
    content: "This is the captured message",
    createdTimestamp: Date.UTC(2026, 0, 10),
    createdAt: new Date(Date.UTC(2026, 0, 10)),
    url: "https://discord.com/channels/guild-id/honeypot-channel/message-id",
    author: {
      id: "user-id",
      bot: false,
      tag: "example-user",
      createdTimestamp: Date.UTC(2025, 11, 1),
      displayAvatarURL: () => "https://cdn.discordapp.com/avatar.png",
    },
    member,
    attachments: new Collection(),
    stickers: new Collection(),
    inGuild: () => true,
    guild: {
      id: "guild-id",
      name: "Test Guild",
      ownerId: "owner-id",
      members: { fetch: mock(async () => member) },
      channels: { fetch: fetchChannel },
    },
  };

  return { message: message as any, member, ban, send, fetchChannel };
};

const options = {
  channelId: "honeypot-channel",
  adminChannelId: "admin-channel",
};

describe("handleHoneypotMessage", () => {
  it("ignores messages outside the configured honeypot", async () => {
    const fixture = makeFixture({ channelId: "general-channel" });

    const handled = await handleHoneypotMessage(fixture.message, options);

    expect(handled).toBe(false);
    expect(fixture.ban).not.toHaveBeenCalled();
    expect(fixture.send).not.toHaveBeenCalled();
  });

  it("bans an ordinary member and sends a detailed incident report", async () => {
    const fixture = makeFixture();

    const handled = await handleHoneypotMessage(fixture.message, options);

    expect(handled).toBe(true);
    expect(fixture.ban).toHaveBeenCalledTimes(1);
    expect(fixture.fetchChannel).toHaveBeenCalledWith("admin-channel");
    expect(fixture.send).toHaveBeenCalledTimes(1);

    const payload = fixture.send.mock.calls[0][0] as any;
    const embed = payload.embeds[0].toJSON();
    expect(embed.title).toContain("member banned");
    expect(embed.fields.some((field: any) => field.name === "Message content"))
      .toBe(true);
    expect(
      embed.fields.find((field: any) => field.name === "Action").value
    ).toContain("Banned successfully");
    expect(payload.allowedMentions).toEqual({ parse: [] });
  });

  it("reports but does not ban members with moderation permissions", async () => {
    const fixture = makeFixture({ protectedMember: true });

    const handled = await handleHoneypotMessage(fixture.message, options);

    expect(handled).toBe(true);
    expect(fixture.ban).not.toHaveBeenCalled();
    expect(fixture.send).toHaveBeenCalledTimes(1);

    const payload = fixture.send.mock.calls[0][0] as any;
    const embed = payload.embeds[0].toJSON();
    expect(embed.title).toContain("protected member");
    expect(
      embed.fields.find((field: any) => field.name === "Action").value
    ).toContain("moderation permissions");
  });

  it("reports role hierarchy failures without attempting the ban", async () => {
    const fixture = makeFixture({ bannable: false });

    const handled = await handleHoneypotMessage(fixture.message, options);

    expect(handled).toBe(true);
    expect(fixture.ban).not.toHaveBeenCalled();
    expect(fixture.send).toHaveBeenCalledTimes(1);

    const payload = fixture.send.mock.calls[0][0] as any;
    const embed = payload.embeds[0].toJSON();
    expect(embed.title).toContain("ban failed");
    expect(
      embed.fields.find((field: any) => field.name === "Action").value
    ).toContain("role hierarchy");
  });

  it("consumes webhook messages without banning or reporting them", async () => {
    const fixture = makeFixture({ webhookId: "webhook-id" });

    const handled = await handleHoneypotMessage(fixture.message, options);

    expect(handled).toBe(true);
    expect(fixture.ban).not.toHaveBeenCalled();
    expect(fixture.send).not.toHaveBeenCalled();
  });
});
