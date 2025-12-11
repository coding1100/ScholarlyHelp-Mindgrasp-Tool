import { useAssignmentData } from "@/app/(pages)/assignment/AssignmentDataProvider";
import { useExamData } from "@/app/(pages)/exam/ExamDataProvider";
import { useHomeworkData } from "@/app/(pages)/homework/HomeworkDataProvider";
import { useOnlineClassData } from "@/app/(pages)/online-class/OnlineClassDataProvider";
import { useEssayWritingData } from "@/app/(pages)/essay-writing/EssayWritingDataProvider";

/**
 * Generic hook that tries to get data from assignment, exam, homework, online-class, and essay-writing contexts
 * This allows components to work with assignment, exam, homework, online-class, and essay-writing pages
 */
export function usePageData() {
  const assignmentData = useAssignmentData();
  const examData = useExamData();
  const homeworkData = useHomeworkData();
  const onlineClassData = useOnlineClassData();
  const essayWritingData = useEssayWritingData();
  
  // Return whichever context has data, or null if none have data
  return assignmentData || examData || homeworkData || onlineClassData || essayWritingData;
}

