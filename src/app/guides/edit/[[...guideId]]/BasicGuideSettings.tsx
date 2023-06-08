'use client';

import Block from '@/components/app/Block';
import EllipsisDropdown from '@/components/core/dropdowns/EllipsisDropdown';
import { EditGuideStepper } from '@/components/guides/Edit/EditGuideStepper';
import { UseEditGuideHelper } from '@/components/guides/Edit/useEditGuide';
import { GuideFragment, Space } from '@/graphql/generated/generated-types';
import { useI18 } from '@/hooks/useI18';
import { PublishStatus } from '@/types/deprecated/models/enums';
import { statuses } from '@/utils/ui/statuses';
import React from 'react';

type GuideProps = {
  space: Space;
  guide: GuideFragment;
  guideErrors: Record<string, any>;
  editGuideHelper: UseEditGuideHelper;
};

const Guide: React.FC<GuideProps> = ({ editGuideHelper, guide, guideErrors, space }) => {
  const selectPublishStatus = (status: PublishStatus) => {
    editGuideHelper.updateGuideFunctions.updateGuideField('publishStatus', status);
  };
  const { $t } = useI18();

  return (
    <div>
      {/* Basic Info Section */}
      <Block title={$t('guide.create.basicInfo')} className="mt-4">
        <div className="mt-4">
          <div>Publish Status * </div>
          <div className="flex justify-start ">
            <div className="pr-1 select-none">{guide.publishStatus === 'Live' ? 'Live' : 'Draft'}</div>
            <div className="ml-2">
              <EllipsisDropdown items={statuses} onSelect={(value) => selectPublishStatus(value as PublishStatus)} />
            </div>
          </div>
        </div>
      </Block>

      {/* Step By Step Section */}
      {guide && (
        <Block title="$t('guide.create.stepByStep')" slim>
          <div className="mt-4">
            <EditGuideStepper guide={guide} guideErrors={guideErrors} space={space} editGuideHelper={editGuideHelper} />
          </div>
        </Block>
      )}

      {/* Error Section */}
      {Object.values(guideErrors).filter((v) => !!v).length > 0 && (
        <div className="!text-red flex text-center justify-center mb-2 align-baseline">
          <i className="iconfont iconwarning !text-red"></i>
          <span className="ml-1">Fix errors to proceed. Make sure you have selected a correct answer for each question</span>
        </div>
      )}
    </div>
  );
};

export default Guide;
