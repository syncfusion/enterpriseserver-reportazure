ALTER TABLE "SyncRS_ScheduleDetail" MODIFY COLUMN "IsSendAsMail" DROP default 
;
ALTER TABLE "SyncRS_ScheduleDetail" MODIFY COLUMN "IsSendAsMail" SET default 1 
;