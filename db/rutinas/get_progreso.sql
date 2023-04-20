DELIMITER $$
CREATE DEFINER=`root`@`localhost` 
FUNCTION `get_progreso`(`epic_Link` VARCHAR(30)) RETURNS int(11)
BEGIN
    DECLARE progreso INT;
    CALL spProgreso(epic_Link, @progreso);
    RETURN @progreso;
END$$
DELIMITER ;