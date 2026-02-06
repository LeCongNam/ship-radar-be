import { Order } from '../../../../generated/prisma/client';

/**
 * Danh sách các String định danh trạng thái để tránh gõ nhầm (Magic strings)
 */
export type StatusName =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELED';

/**
 * 1. Interface State
 */
interface OrderState {
  name: StatusName;

  order: Order;
  userInfo: JwtDataReturn;

  // Hàm xử lý việc chuyển đổi trạng thái tổng quát
  canMoveTo(targetName: StatusName): boolean;

  // Hàm xử lý yêu cầu hủy riêng biệt
  handleCancel(order: OrderStateFactory): void;
}

/**
 * 2. Các lớp trạng thái cụ thể
 */

class PendingState implements OrderState {
  name: StatusName = 'PENDING';

  constructor(order: Order, userInfo: JwtDataReturn) {
    this.order = order;
    this.userInfo = userInfo;
  }
  userInfo: JwtDataReturn;
  order: Order;

  canMoveTo(targetName: StatusName): boolean {
    // if (this.userInfo.roles.includes('ADMIN') === false) {
    //   console.log(
    //     '-> Lỗi: Chỉ ADMIN mới có quyền chuyển trạng thái đơn hàng từ Pending.',
    //   );
    //   return false;
    // }
    console.log(this.userInfo);

    // Pending chỉ có thể sang Shipping hoặc Canceled
    return (
      targetName === 'SHIPPING' ||
      targetName === 'CANCELED' ||
      targetName === 'PROCESSING'
    );
  }

  handleCancel(order: OrderStateFactory) {
    console.log('-> Đang ở Pending: Chấp nhận hủy ngay.');
    order.forceSetState(new CanceledState(this.order, this.userInfo));
  }
}

class ShippingState implements OrderState {
  order: Order;
  name: StatusName = 'SHIPPING';

  constructor(order: Order, userInfo: JwtDataReturn) {
    this.order = order;
    this.userInfo = userInfo;
  }
  userInfo: JwtDataReturn;

  canMoveTo(targetName: StatusName): boolean {
    // Shipping chỉ có thể sang Completed hoặc Failed
    return targetName === 'COMPLETED' || targetName === 'FAILED';
  }

  handleCancel(order: OrderStateFactory) {
    console.log(
      '-> Đang ở Shipping: Không thể hủy trực tiếp, đánh dấu là Failed.',
    );
    order.forceSetState(new FailedState(this.order, this.userInfo));
  }
}

class CompletedState implements OrderState {
  constructor(order: Order, userInfo: JwtDataReturn) {
    this.order = order;
    this.userInfo = userInfo;
  }
  userInfo: JwtDataReturn;
  order: Order;
  name: StatusName = 'COMPLETED';
  canMoveTo = () => false; // Trạng thái cuối, không đi đâu cả
  handleCancel = () => console.log('-> Lỗi: Đơn đã thành công, không thể hủy.');
}

class FailedState implements OrderState {
  constructor(order: Order, user: JwtDataReturn) {
    this.order = order;
    this.user = user;
  }
  userInfo: JwtDataReturn;
  user: JwtDataReturn;
  order: Order;
  name: StatusName = 'FAILED';
  canMoveTo = () => false;
  handleCancel = () => console.log('-> Lỗi: Đơn đã thất bại sẵn rồi.');
}

class CanceledState implements OrderState {
  constructor(order: Order, userInfo: JwtDataReturn) {
    this.order = order;
    this.userInfo = userInfo;
  }
  userInfo: JwtDataReturn;
  order: Order;
  name: StatusName = 'CANCELED';
  canMoveTo = () => false;
  handleCancel = () => console.log('-> Lỗi: Đơn đã hủy trước đó.');
}

class Processing implements OrderState {
  constructor(order: Order, userInfo: JwtDataReturn) {
    this.order = order;
    this.userInfo = userInfo;
  }
  userInfo: JwtDataReturn;
  order: Order;
  name: StatusName = 'PROCESSING';
  canMoveTo = (targetName: StatusName) => {
    return targetName === 'SHIPPING' || targetName === 'CANCELED';
  };
  handleCancel = () => console.log('-> Lỗi: Đơn đang xử lý, không thể hủy.');
}

/**
 * 3. Lớp Context (Order) - Nơi chứa logic "switch"
 */
export class OrderStateFactory {
  private state: OrderState;

  private _order?: any;

  private userInfo: JwtDataReturn;

  constructor({
    order,
    initialStatus,
    userInfo,
  }: {
    order: Order;
    initialStatus: StatusName;
    userInfo: JwtDataReturn;
  }) {
    this._order = order;
    // Logic khởi tạo từ String (giống như lấy từ DB)
    this.state = this.mapStatusToState(initialStatus);
    this.userInfo = userInfo;
  }

  // Hàm Factory phụ trợ
  private mapStatusToState(status: StatusName): OrderState {
    switch (status) {
      case 'PENDING':
        return new PendingState(this._order, this.userInfo);
      case 'SHIPPING':
        return new ShippingState(this._order, this.userInfo);
      case 'COMPLETED':
        return new CompletedState(this._order, this.userInfo);
      case 'FAILED':
        return new FailedState(this._order, this.userInfo);
      case 'CANCELED':
        return new CanceledState(this._order, this.userInfo);
      case 'PROCESSING':
        return new Processing(this._order, this.userInfo);
      default:
        throw new Error('Trạng thái không hợp lệ');
    }
  }

  // Hàm đổi trạng thái theo yêu cầu của bạn
  public switch(newStatus: StatusName) {
    console.log(`\nThử chuyển: ${this.state.name} ---> ${newStatus}`);

    if (!this.state.canMoveTo(newStatus)) {
      console.error(
        `❌ Thất bại! Không thể chuyển từ ${this.state.name} sang ${newStatus}`,
      );

      return {
        oldOrder: this._order,
        switched: false,
        message: `Cannot switch from ${this.state.name} to ${newStatus}`,
      };
    }

    this.state = this.mapStatusToState(newStatus);
    const newOrder = Object.assign({}, this._order, { status: newStatus });

    console.log(`✅ Thành công! Trạng thái mới: ${this.state.name}`);

    return {
      oldOrder: this._order,
      newOrder,
      switched: true,
      message: `Switched to ${this.state.name} successfully`,
    };
  }

  // Hàm xử lý yêu cầu hủy
  public requestCanceled() {
    console.log(`\nYêu cầu hủy đơn hàng (Hiện tại: ${this.state.name})`);
    this.state.handleCancel(this);
  }

  // Dùng nội bộ để các State đổi trạng thái của Context
  public forceSetState(state: OrderState) {
    this.state = state;
    console.log(`✅ Đã chuyển trạng thái cưỡng ép sang: ${this.state.name}`);
  }
}
