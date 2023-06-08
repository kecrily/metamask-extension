import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { WALLET_SNAP_PERMISSION_KEY } from '@metamask/rpc-methods';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import Box from '../../../../components/ui/box';
import SiteOrigin from '../../../../components/ui/site-origin';
import IconWithFallback from '../../../../components/ui/icon-with-fallback/icon-with-fallback.component';
import {
  Icon,
  IconName,
  IconSize,
  Text,
} from '../../../../components/component-library';
import {
  IconColor,
  FlexDirection,
  TextVariant,
  JustifyContent,
  AlignItems,
  TextAlign,
  Display,
} from '../../../../helpers/constants/design-system';
import { PageContainerFooter } from '../../../../components/ui/page-container';
import SnapConnectCell from '../../../../components/app/snaps/snap-connect-cell/snap-connect-cell';
import { getSnapName } from '../../../../helpers/utils/util';
import PulseLoader from '../../../../components/ui/pulse-loader/pulse-loader';
import SnapPrivacyWarning from '../../../../components/app/snaps/snap-privacy-warning/snap-privacy-warning';

export default function SnapsConnect({
  request,
  approveConnection,
  rejectConnection,
  targetSubjectMetadata,
  snapsInstallPrivacyWarningShown,
  setSnapsInstallPrivacyWarningShownStatus,
}) {
  const t = useI18nContext();
  const { origin, iconUrl, name } = targetSubjectMetadata;
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingSnapsPrivacyWarning, setIsShowingSnapsPrivacyWarning] =
    useState(!snapsInstallPrivacyWarningShown);

  const onCancel = useCallback(() => {
    rejectConnection(request.metadata.id);
  }, [request, rejectConnection]);

  const onConnect = useCallback(() => {
    try {
      setIsLoading(true);
      approveConnection(request);
    } finally {
      setIsLoading(false);
    }
  }, [request, approveConnection]);

  const getSnaps = () => {
    const permission = request.permissions?.[WALLET_SNAP_PERMISSION_KEY];
    const requestedSnaps = permission?.caveats?.[0].value;
    return requestedSnaps ? Object.keys(requestedSnaps) : [];
  };

  const SnapsConnectContent = () => {
    const snaps = getSnaps();
    if (isLoading) {
      return (
        <Box
          className="snap-connect__loader-container"
          flexDirection={FlexDirection.Column}
          alignItems={AlignItems.center}
          justifyContent={JustifyContent.center}
        >
          <PulseLoader />
        </Box>
      );
    }
    if (snaps?.length > 1) {
      return (
        <Box
          className="snaps-connect__content"
          flexDirection={FlexDirection.Column}
          justifyContent={JustifyContent.center}
          alignItems={AlignItems.center}
          paddingLeft={4}
          paddingRight={4}
          height="full"
          width="full"
        >
          <Box
            className="snaps-connect__content__snaps-list"
            flexDirection={FlexDirection.Column}
            display={Display.Flex}
            width="full"
            height="full"
          >
            {snaps.map((snap) => (
              // TODO(hbmalik88): add in the iconUrl prop when we have access to a snap's icons pre-installation
              <SnapConnectCell
                key={`snaps-connect-${snap}`}
                snapId={snap}
                origin={origin}
              />
            ))}
          </Box>
        </Box>
      );
    } else if (snaps?.length === 1) {
      return (
        <Box
          className="snaps-connect__content"
          flexDirection={FlexDirection.Column}
          justifyContent={JustifyContent.center}
          alignItems={AlignItems.center}
          paddingLeft={4}
          paddingRight={4}
        >
          <Box
            className="snaps-connect__content__icons"
            flexDirection={FlexDirection.Row}
            display={Display.Flex}
            alignItems={AlignItems.center}
            paddingBottom={2}
          >
            <IconWithFallback
              className="snaps-connect__content__icons__site-icon"
              icon={iconUrl}
              name={name}
              size={32}
            />
            <hr className="snaps-connect__content__icons__connection-line" />
            <Icon
              className="snaps-connect__content__icons__question"
              name={IconName.Question}
              size={IconSize.Xl}
              color={IconColor.infoInverse}
            />
            <hr className="snaps-connect__content__icons__connection-line" />
            <Icon
              className="snaps-connect__content__icons__snap"
              name={IconName.Snaps}
              size={IconSize.Xl}
              color={IconColor.primaryDefault}
            />
          </Box>
          <Text paddingBottom={2} variant={TextVariant.headingLg}>
            {t('connectionRequest')}
          </Text>
          <Text
            variant={TextVariant.bodyMd}
            textAlign={TextAlign.Center}
            padding={[0, 4]}
          >
            {t('snapConnectionWarning', [
              <b key="0">{origin}</b>,
              <b key="1">{getSnapName(snaps?.[0])}</b>,
            ])}
          </Text>
        </Box>
      );
    }
    return null;
  };

  const snaps = getSnaps();
  const isMultiSnapConnect = snaps?.length > 1;

  return (
    <Box
      className="page-container snaps-connect"
      flexDirection={FlexDirection.Column}
      justifyContent={JustifyContent.spaceBetween}
      alignItems={AlignItems.center}
    >
      {isShowingSnapsPrivacyWarning && (
        <SnapPrivacyWarning
          onAccepted={() => {
            setIsShowingSnapsPrivacyWarning(false);
            setSnapsInstallPrivacyWarningShownStatus(true);
          }}
          onCanceled={onCancel}
        />
      )}
      <Box style={{ overflow: 'auto' }}>
        <Box
          className="snaps-connect__header"
          flexDirection={FlexDirection.Column}
          alignItems={AlignItems.center}
          paddingLeft={4}
          paddingRight={4}
          paddingBottom={4}
        >
          <SiteOrigin
            chip
            siteOrigin={origin}
            title={origin}
            iconSrc={iconUrl}
            name={name}
          />
          {isMultiSnapConnect ? (
            <>
              <Text
                paddingBottom={2}
                paddingTop={8}
                variant={TextVariant.headingLg}
              >
                {t('connectionRequest')}
              </Text>
              <Text variant={TextVariant.bodyMd} textAlign={TextAlign.Center}>
                {t('multipleSnapConnectionWarning', [
                  <b key="0">{origin}</b>,
                  <b key="1">{snaps?.length}</b>,
                ])}
              </Text>
            </>
          ) : null}
        </Box>
        <SnapsConnectContent />
      </Box>
      <Box
        className="snaps-connect__footer"
        style={{
          width: '100%',
          boxShadow: 'var(--shadow-size-lg) var(--color-shadow-default)',
        }}
      >
        <PageContainerFooter
          footerClassName="snaps-connect__footer"
          cancelButtonType="default"
          hideCancel={false}
          disabled={isLoading}
          onCancel={onCancel}
          cancelText={t('cancel')}
          onSubmit={onConnect}
          submitText={t('connect')}
        />
      </Box>
    </Box>
  );
}

SnapsConnect.propTypes = {
  request: PropTypes.object.isRequired,
  approveConnection: PropTypes.func.isRequired,
  rejectConnection: PropTypes.func.isRequired,
  targetSubjectMetadata: PropTypes.shape({
    extensionId: PropTypes.string,
    iconUrl: PropTypes.string,
    name: PropTypes.string,
    origin: PropTypes.string,
    subjectType: PropTypes.string,
  }),
  snapsInstallPrivacyWarningShown: PropTypes.bool.isRequired,
  setSnapsInstallPrivacyWarningShownStatus: PropTypes.func,
};
