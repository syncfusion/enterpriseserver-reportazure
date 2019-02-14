ALTER TABLE {database_name}.SyncRS_ScheduleDetail ADD IsSaveAsFile tinyint(1) NOT NULL default 0
;
ALTER TABLE {database_name}.SyncRS_ScheduleDetail ADD IsSendAsMail tinyint(1) NOT NULL default 0
;
ALTER TABLE {database_name}.SyncRS_ScheduleDetail ADD ReportCount int NOT NULL DEFAULT 0
;
ALTER TABLE {database_name}.SyncRS_ScheduleDetail ADD ExportPath varchar(4000) NOT NULL
;
