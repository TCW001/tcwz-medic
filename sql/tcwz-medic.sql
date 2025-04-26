USE `complexo`;

DROP TABLE IF EXISTS `tcwz_medic-psicotecnico`;
CREATE TABLE IF NOT EXISTS `tcwz_medic-psicotecnico` (
  `user_id` INT(11) NOT NULL,
  `register_id` VARCHAR(7) NOT NULL DEFAULT 'xxx-xxx' UNIQUE NOT NULL,
  `medic_id` INT(11) NOT NULL,
  `signatureMedic` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Em Analise',
  `date` varchar(10) NOT NULL DEFAULT 'dd/mm/yyyy',
  `type` varchar(15) NOT NULL,
  `name` varchar(20) NOT NULL,
  `name2` varchar(20) NOT NULL,
  `age` INT(3) NOT NULL,
  `contact` varchar(12) NOT NULL,
  `job` varchar(50) NOT NULL,
  `desc_result` varchar(250) NOT NULL,
  `result` varchar(10) NOT NULL,
  PRIMARY KEY (`register_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `tcwz_medic-pscicologico`;
CREATE TABLE IF NOT EXISTS `tcwz_medic-pscicologico` (
  `user_id` INT(11) NOT NULL,
  `register_id` VARCHAR(7) NOT NULL DEFAULT 'xxx-xxx' UNIQUE NOT NULL,
  `medic_id` INT(11) NOT NULL,
  `signatureMedic` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Em Analise',
  `type` varchar(15) NOT NULL,
  `date` varchar(10) NOT NULL DEFAULT 'dd/mm/yyyy',
  `name` varchar(20) NOT NULL,
  `name2` varchar(20) NOT NULL,
  `age` INT(3) NOT NULL,
  `contact` varchar(12) NOT NULL,
  `hist_clinico` varchar(250) NOT NULL,
  `avaliacao` varchar(250) NOT NULL,
  `recom_tratamento` varchar(250) NOT NULL,
  `parecer` varchar(250) NOT NULL,
  PRIMARY KEY (`register_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `tcwz_medic-mascara`;
CREATE TABLE IF NOT EXISTS `tcwz_medic-mascara` (
  `user_id` INT(11) NOT NULL,
  `register_id` VARCHAR(7) NOT NULL DEFAULT 'xxx-xxx' UNIQUE NOT NULL,
  `medic_id` INT(11) NOT NULL,
  `signatureMedic` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Em Analise',
  `type` varchar(15) NOT NULL,
  `date` varchar(10) NOT NULL DEFAULT 'dd/mm/yyyy',
  `name` varchar(20) NOT NULL,
  `name2` varchar(20) NOT NULL,
  `age` INT(3) NOT NULL,
  `contact` varchar(12) NOT NULL,
  `diagnostico` varchar(250) NOT NULL,
  `caracteristicas` varchar(250) NOT NULL,
  `identificacao` varchar(30) NOT NULL,
  `parecer` varchar(250) NOT NULL,
  PRIMARY KEY (`register_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;