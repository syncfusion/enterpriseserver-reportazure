ALTER TABLE SyncRS_ScheduleDetail ADD IsSaveAsFile smallint NOT NULL default 0
;
ALTER TABLE SyncRS_ScheduleDetail ADD IsSendAsMail smallint NOT NULL default 0
;
ALTER TABLE SyncRS_ScheduleDetail ADD ReportCount int NOT NULL DEFAULT 0
;
ALTER TABLE SyncRS_ScheduleDetail ADD ExportPath varchar(4000) NULL
;
