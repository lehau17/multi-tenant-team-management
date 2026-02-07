import { Column, PrimaryColumn } from "typeorm"

export abstract class TypeOrmBaseEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string
  @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
  @Column({ type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
  @Column({ type: "timestamptz", nullable: true })
  deletedAt: Date
  @Column({ type: "varchar", nullable: true })
  createdBy: string
  @Column({ type: "varchar", nullable: true })
  updatedBy: string
  @Column({ type: "varchar", nullable: true })
  deletedBy: string
}
