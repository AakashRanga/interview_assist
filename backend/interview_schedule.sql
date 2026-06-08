-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2026 at 06:02 AM
-- Server version: 8.0.45
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `interview_assist`
--

-- --------------------------------------------------------

--
-- Table structure for table `interview_schedule`
--

CREATE TABLE `interview_schedule` (
  `id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `job_id` int DEFAULT NULL,
  `gmeet_link` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `interview_status` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `interview_schedule`
--

INSERT INTO `interview_schedule` (`id`, `candidate_id`, `job_id`, `gmeet_link`, `date`, `start_time`, `end_time`, `interview_status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, '2026-06-08', '10:00:00', '11:00:00', 'failed', '2026-06-08 03:31:17', '2026-06-08 03:31:17'),
(2, 2, 1, NULL, '2026-06-08', '11:00:00', '12:00:00', 'failed', '2026-06-08 03:48:10', '2026-06-08 03:48:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interview_schedule`
--
ALTER TABLE `interview_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_interview_schedule_job_id` (`job_id`),
  ADD KEY `ix_interview_schedule_candidate_id` (`candidate_id`),
  ADD KEY `ix_interview_schedule_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interview_schedule`
--
ALTER TABLE `interview_schedule`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `interview_schedule`
--
ALTER TABLE `interview_schedule`
  ADD CONSTRAINT `interview_schedule_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`),
  ADD CONSTRAINT `interview_schedule_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
