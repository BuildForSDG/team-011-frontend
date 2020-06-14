import { BaseResDto } from "./base-response.dto";

export type NotificationType = "Payment" | "RequestApproval";
export interface CreateNotificationDto {
  to: string;
  metadata: any;
  title: NotificationType;
}
export interface NotificationDto extends BaseResDto, CreateNotificationDto {}
