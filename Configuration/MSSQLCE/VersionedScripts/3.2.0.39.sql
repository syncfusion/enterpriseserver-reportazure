ALTER TABLE [SyncRS_ScheduleDetail] ADD [IsSaveAsFile] Bit Not Null default '0'
;
ALTER TABLE [SyncRS_ScheduleDetail] ADD [IsSendAsMail] Bit Not Null default '0'
;
ALTER TABLE [SyncRS_ScheduleDetail] ADD [ReportCount] Bit Not Null default '0'
;
ALTER TABLE [SyncRS_ScheduleDetail] ADD [ExportPath] [nvarchar](4000) NULL
;
