DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spProgreso`(IN `_epic_Link` VARCHAR(30), OUT `progreso` INT)
BEGIN
  DECLARE total_tickets INT DEFAULT 0;
  DECLARE total_status INT DEFAULT 0;
  
  SELECT COUNT(*) INTO total_tickets FROM tickets WHERE epic_Link = _epic_Link;
  SELECT COUNT(*) INTO total_status FROM tickets WHERE epic_Link = _epic_Link AND ticket_Status IN ('Done', 'Closed');
  
  IF total_tickets > 0 THEN
    SET progreso = (total_status / total_tickets) * 100;
  ELSE
    SET progreso = 0;
  END IF;
END$$
DELIMITER ;