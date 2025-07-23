import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753255729733 implements MigrationInterface {
  name = 'Init1753255729733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" RENAME COLUMN "someBalance" TO "balance"`,
    );
    await queryRunner.query(
      `CREATE TABLE "movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "from_id" uuid, "to_id" uuid, CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "CHK_addbc7bd2e197dafc204ca1c76" CHECK ("balance" >= 0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" ADD CONSTRAINT "FK_ba75b6592834c8762c35a8055dc" FOREIGN KEY ("from_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" ADD CONSTRAINT "FK_f09066f0e26d6869fde323d4f39" FOREIGN KEY ("to_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movements" DROP CONSTRAINT "FK_f09066f0e26d6869fde323d4f39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movements" DROP CONSTRAINT "FK_ba75b6592834c8762c35a8055dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "CHK_addbc7bd2e197dafc204ca1c76"`,
    );
    await queryRunner.query(`DROP TABLE "movements"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" RENAME COLUMN "balance" TO "someBalance"`,
    );
  }
}
