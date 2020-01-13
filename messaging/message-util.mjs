import { MessagePartBytes } from "../messaging/constants.mjs";
export class MessageUtil {
    static seperateMessagePartBuffer(messagePartBuffer) {

        let lengthPartLength = messagePartBuffer[MessagePartBytes.LENGTH] > 0x80 ?
            messagePartBuffer[MessagePartBytes.LENGTH] % 0x80 : 0;

        return {
            type: messagePartBuffer[MessagePartBytes.TYPE],
            length: messagePartBuffer.slice(MessagePartBytes.LENGTH, lengthPartLength + 2),
            value: messagePartBuffer.slice(lengthPartLength + 2)
        }
    }
}