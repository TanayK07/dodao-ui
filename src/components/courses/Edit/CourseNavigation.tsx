import AddIcon from '@/components/app/Icons/AddIcon';
import { Tree } from '@/components/app/TreeView/Tree';
import { TreeNodeType } from '@/components/app/TreeView/TreeNode';
import Button from '@/components/core/buttons/Button';
import { CourseSubmissionHelper } from '@/components/courses/View/useCourseSubmission';
import { CourseHelper } from '@/components/courses/View/useViewCourse';
import {
  CourseDetailsFragment,
  CourseExplanationFragment,
  CourseReadingFragment,
  CourseSummaryFragment,
  CourseTopicFragment,
  Space,
} from '@/graphql/generated/generated-types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface CourseNavigationProps {
  course: CourseDetailsFragment;
  space: Space;
  showAddModal: () => void;
  courseHelper: CourseHelper;
  submissionHelper: CourseSubmissionHelper;
}
const ClickableDiv = styled.div`
  cursor: pointer;
`;

const CheckMark = styled.div`
  position: relative;
  height: 20px;
  width: 20px;
  text-align: center;
  background-color: #00813a;
  border: 1px solid #00813a;
  border-radius: 50%;
  z-index: 1;

  &:after {
    content: '';
    left: 6px;
    top: 3px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: absolute;
  }
`;

const Container = styled.div`
  .icon {
    display: flex;
  }

  .nav-item {
    @apply mb-2;
    color: var(--text-color);

    &.active {
      background: rgba(255, 255, 255, 0.2);
      @apply font-bold text-primary;

      .icon {
        svg {
          fill: var(--primary-color);
        }
      }
    }
  }

  .item-title {
    max-height: 40px;
  }

  .nav-list {
    margin-left: 0;
    list-style-type: none;
  }

  .checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    text-align: center;
    background-color: #00813a;
    border: 1px solid #00813a;
    border-radius: 50%;
    z-index: 1;

    &:after {
      content: '';
      left: 6px;
      top: 3px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      position: absolute;
    }
  }
`;

const CourseComponent: React.FC<CourseNavigationProps> = ({ course, space, showAddModal, courseHelper }) => {
  const isCourseAdmin = true;
  const [openChapter, setOpenChapter] = useState(location.pathname);
  const [nodemap, setNodemap] = useState<any>({});

  const handleToggle = (key: string, open: boolean) => {
    if (open) {
      setOpenChapter(key);
    } else {
      setOpenChapter('');
    }
  };

  const handleToggleSubHeading = (key: string, open: boolean) => {
    setNodemap({ ...nodemap, [key]: open });
  };

  useEffect(() => {
    if (location.pathname === 'courseSummary') {
      setNodemap({ ...nodemap, [`summary-${location.pathname}`]: true });
    } else if (location.pathname === 'courseReading') {
      setNodemap({ ...nodemap, [`reading-${location.pathname}`]: true });
    } else if (location.pathname === 'courseExplanation') {
      setNodemap({ ...nodemap, [`explanation-${location.pathname}`]: true });
    }
    if (location.pathname) {
      setOpenChapter(location.pathname);
    }
  }, [location]);

  function getReadings(topic: CourseTopicFragment, readings: CourseReadingFragment[]) {
    return readings.map((reading, i) => {
      return {
        component: (
          <ClickableDiv
            key={reading.uuid}
            className="flex items-center"
            onClick={() => courseHelper.goToLink(`/courses/view/${course.key}/${topic.key}/readings/${reading.uuid}`)}
          >
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>{reading.title}</div>
          </ClickableDiv>
        ),
      };
    });
  }

  function getExplanations(topic: CourseTopicFragment, explanations: CourseExplanationFragment[]) {
    return explanations.map((explanation, i) => {
      return {
        component: (
          <ClickableDiv
            key={explanation.key}
            className="flex items-center"
            onClick={() => courseHelper.goToLink(`/courses/view/${course.key}/${topic.key}/explanations/${explanation.key}`)}
          >
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>{explanation.title}</div>
          </ClickableDiv>
        ),
      };
    });
  }
  function getSummaries(topic: CourseTopicFragment, summaries: CourseSummaryFragment[]) {
    return summaries.map((summary, i) => {
      return {
        component: (
          <ClickableDiv
            key={summary.key}
            className="flex items-center"
            onClick={() => courseHelper.goToLink(`/courses/view/${course.key}/${topic.key}/summaries/${summary.key}`)}
          >
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>{summary.title}</div>
          </ClickableDiv>
        ),
      };
    });
  }

  const treeData1: TreeNodeType[] = course.topics.map((chapter, i) => {
    const readings: TreeNodeType[] = getReadings(chapter, chapter.readings);
    const explanations: TreeNodeType[] = getExplanations(chapter, chapter.explanations);
    const summaries: TreeNodeType[] = getSummaries(chapter, chapter.summaries);

    const children: TreeNodeType[] = [];
    if (readings.length) {
      children.push({
        component: (
          <ClickableDiv key={chapter.key + '_readings'} className="flex items-center">
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>Videos</div>
          </ClickableDiv>
        ),
        children: readings,
      });
    }
    if (explanations.length) {
      children.push({
        component: (
          <div key={chapter.key + '_explanations'} className="flex items-center">
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>Explanations</div>
          </div>
        ),
        children: explanations,
      });
    }
    if (summaries.length) {
      children.push({
        component: (
          <div key={chapter.key + '_summaries'} className="flex items-center">
            <div className="icon mr-2">
              <CheckMark />
            </div>
            <div>Summaries</div>
          </div>
        ),
        children: summaries,
      });
    }
    return {
      component: (
        <Link key={chapter.key + '_chapter_root'} className="flex items-center" href={`/courses/view/${course.key}/${chapter.key}`}>
          <div className="icon mr-2">
            <CheckMark />
          </div>
          <div>{chapter.title}</div>
        </Link>
      ),
      children: children,
    };
  });

  return (
    <Container className="p-4 bg-skin-header-bg rounded-l-lg border-skin-border h-full w-full">
      {isCourseAdmin && (
        <Button primary variant="contained" className="w-full mb-4" onClick={showAddModal}>
          <AddIcon /> Add
        </Button>
      )}
      <Tree data={treeData1} />
    </Container>
  );
};

export default CourseComponent;
