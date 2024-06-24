import type { ITXClientDenyList } from "@prisma/client/runtime/library";
import type { PrismaClient, User } from "@prisma/client";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordChangeEmailQueue } from "./queues";

export async function updatePassword(
  newPassword: string,
  user: User,
  prismaInstance?: Omit<PrismaClient, ITXClientDenyList>,
) {
  const prismaI = prismaInstance || prisma;
  const passwordHash = await hash(newPassword, 6);

  await prismaI.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash,
    },
  });

  await sendPasswordChangeEmailQueue.add("send-password-change-email", {
    user,
  });
}
