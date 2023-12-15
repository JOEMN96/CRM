import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  prisma.$queryRaw`

        -- Example Trigger

        -- DROP TRIGGER IF EXISTS 'crm'.'AddCalenderEntryNotification';

        DELIMITER $$

        CREATE TRIGGER  AddCalenderEntryNotification BEFORE INSERT ON calender
          FOR EACH ROW
            BEGIN
            SET @USERID = (SELECT userId FROM project WHERE id= NEW.projectID);
            IF NOT EXISTS  (SELECT id FROM notification WHERE userId=@USERID AND DATE('createdAt') LIKE  CONCAT('%',CURDATE(),'%') LIMIT 1) = NULL THEN
              SET @USERNAME = (SELECT name FROM users WHERE id=@USERID);
              INSERT INTO notification (message, type, userId) VALUES ( CONCAT('New Time Entry Added by ', @USERNAME), 'INFO', @USERID);
            END IF;
          END$$

        DELIMITER ;
    `;
}

main()
  .then(async () => {
    console.log('Stored Procedures and Triggers are created');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
