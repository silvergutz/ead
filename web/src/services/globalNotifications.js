import { Subject } from 'rxjs';
import { v1 } from 'uuid';

const subject = new Subject();

const globalNotifications = {
  sendMessage,
  sendDebugMessage:   (content) => sendMessage({ content, type: 'debug' }),
  sendInfoMessage:    (content) => sendMessage({ content, type: 'info' }),
  sendSuccessMessage: (content) => sendMessage({ content, type: 'success' }),
  sendWarningMessage: (content) => sendMessage({ content, type: 'warning' }),
  sendErrorMessage:   (content) => sendMessage({ content, type: 'error' }),

  clearMessages: () => subject.next(),
  getMessage: () => subject.asObservable(),
}

function sendMessage(message) {
  if (!message.id) {
    message.id = v1();
  }
  if (message.type !== 'debug') {
    message.autoClose = true;
    if (['info','success'].indexOf(message.type) > -1) {
      message.autoCloseTime = 3000;
    } else {
      message.autoCloseTime = 7000;
    }
  }
  subject.next(message);
}

export default globalNotifications;
