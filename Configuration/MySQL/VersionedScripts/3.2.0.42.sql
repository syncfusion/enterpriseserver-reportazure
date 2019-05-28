ALTER TABLE {database_name}.SyncRS_ScheduleDetail MODIFY COLUMN [IsSendAsMail] DROP default
;
ALTER TABLE {database_name}.SyncRS_ScheduleDetail MODIFY COLUMN [IsSendAsMail] SET default 1
;