CREATE TABLE [ServerVersion](
[VersionNumber] [nvarchar](20) NOT NULL)
;
ALTER TABLE [Group] ALTER COLUMN Description nvarchar(1026) null
;

ALTER TABLE [Item] ALTER COLUMN Description nvarchar(1026) null
;