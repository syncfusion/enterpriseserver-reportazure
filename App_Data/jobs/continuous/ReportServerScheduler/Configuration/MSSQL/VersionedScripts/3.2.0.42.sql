ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [IsSendAsMail] DROP default
;
ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [IsSendAsMail] SET default 1
;
