import { message } from 'antd';
import { MessageType } from 'antd/lib/message'


export function showSuccess(text: string) {
    message.success(text)
}
export function showInfo(text: string) {
    message.info(text)
}
export function showWarning(text: string) {
    message.warning(text)
}
export function showError(text: string) {
    message.error(text)
}
export function showLoading(text: string): MessageType {
    return message.loading(text)
}
