import { TypeOrmBaseEntity } from "@app/shared";
import { Column, Entity, Index } from "typeorm";
import { TPlanConfig } from "../../domain/dtos/plan.dto";

@Entity("plans")
export class PlanOrmEntity extends TypeOrmBaseEntity {
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 50, unique: true })
  code: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "jsonb" })
  config: TPlanConfig;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;
}
