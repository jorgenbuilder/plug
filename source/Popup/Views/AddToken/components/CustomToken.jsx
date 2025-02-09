import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Button, FormItem, TextInput, Container, Alert,
} from '@ui';
import { validateCanisterId } from '@shared/utils/ids';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import extension from 'extensionizer';
import { customTokensUrl } from '@shared/constants/urls';
import useStyles from '../styles';

const CustomToken = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [invalidToken, setInvalidToken] = useState(null);
  const [tokenError, setTokenError] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleChangeToken = (e) => {
    setToken(e.target.value.trim());
  };

  useEffect(() => {
    if (token) {
      setInvalidToken(!validateCanisterId(token));
    }
  }, [token]);

  const handleSubmit = () => {
    setLoading(true);
    sendMessage({ type: HANDLER_TYPES.GET_TOKEN_INFO, params: token }, async (tokenInfo) => {
      if (tokenInfo?.error) {
        setTokenError(true);
        setInvalidToken(true);
      } else {
        handleChangeSelectedToken(tokenInfo)();
      }
      setLoading(false);
    });
  };

  return (
    <Container style={{ paddingTop: 24 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            smallLabel
            label={t('addToken.tokenCanisterId')}
            component={(
              <TextInput
                fullWidth
                value={token}
                onChange={handleChangeToken}
                type="text"
                error={invalidToken}
              />
            )}
          />
        </Grid>
        {
          tokenError
          && (
          <Grid item xs={12}>
            <div className={classes.appearAnimation}>
              <Alert
                type="danger"
                title={(
                  <div>
                    <span>{t('addToken.tokenError')}</span>
                    <br />
                    <span
                      className={classes.learnMore}
                      onClick={() => extension.tabs.create({ url: customTokensUrl })}
                    >
                      {t('common.learnMore')}
                    </span>
                  </div>
                )}
              />
            </div>
          </Grid>
          )
        }
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            onClick={handleSubmit}
            fullWidth
            disabled={!token || invalidToken || loading || tokenError}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomToken;

CustomToken.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
