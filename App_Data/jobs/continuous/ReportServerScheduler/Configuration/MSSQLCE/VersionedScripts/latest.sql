ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [ReportCount] DROP default
;
ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [ReportCount] [int] NOT NULL
;
ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [ReportCount] SET default 0
;
ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [IsSendAsMail] DROP default
;
ALTER TABLE [SyncRS_ScheduleDetail] ALTER COLUMN [IsSendAsMail] SET default 1
;