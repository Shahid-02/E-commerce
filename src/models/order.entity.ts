import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  cartId: string;

  @Column('simple-json')
  cartItems: {
    productId: string;
    title: string;
    image: string;
    price: string;
    quantity: number;
  }[];

  @Column('simple-json')
  addressInfo: {
    addressId: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes: string;
  };

  @Column()
  orderStatus: string;

  @Column()
  paymentMethod: string;

  @Column()
  paymentStatus: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  orderDate: Date;

  @Column()
  orderUpdateDate: Date;

  @Column()
  paymentId: string;

  @Column()
  payerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
