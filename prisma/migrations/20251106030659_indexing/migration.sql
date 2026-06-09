-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "channel_serverId_idx" ON "channel"("serverId");

-- CreateIndex
CREATE INDEX "message_channelId_createdAt_idx" ON "message"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "server_ownerId_id_name_idx" ON "server"("ownerId", "id", "name");

-- CreateIndex
CREATE INDEX "server_member_userId_idx" ON "server_member"("userId");

-- CreateIndex
CREATE INDEX "session_userId_token_idx" ON "session"("userId", "token");

-- CreateIndex
CREATE INDEX "user_email_id_idx" ON "user"("email", "id");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
