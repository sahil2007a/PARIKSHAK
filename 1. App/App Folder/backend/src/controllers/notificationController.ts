import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';
import { AppError } from '../utils/appError';

export const getUserNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401);

    const notifications = await Notification.find({ userId: req.userId }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications: notifications.map((n) => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          actionUrl: n.actionUrl,
          createdAt: n.createdAt.toISOString()
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!notif) throw new AppError('Notification not found', 404);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification: notif }
    });
  } catch (error) {
    next(error);
  }
};
