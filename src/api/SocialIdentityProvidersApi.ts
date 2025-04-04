import util from 'util';

import { State } from '../shared/State';
import { getCurrentRealmPath } from '../utils/ForgeRockUtils';
import { deleteDeepByKey } from '../utils/JsonUtils';
import { type AmConfigEntityInterface, type PagedResult } from './ApiTypes';
import { generateAmApi } from './BaseApi';

const getAllProviderTypesURLTemplate =
  '%s/json%s/realm-config/services/SocialIdentityProviders?_action=getAllTypes';
const providerByTypeAndIdURLTemplate =
  '%s/json%s/realm-config/services/SocialIdentityProviders/%s/%s';
const getAllProvidersURLTemplate =
  '%s/json%s/realm-config/services/SocialIdentityProviders?_action=nextdescendents';
const getProvidersByTypeURLTemplate =
  '%s/json%s/realm-config/services/SocialIdentityProviders/%s?_queryFilter=true';
const apiVersion = 'protocol=2.1,resource=1.0';
const getApiConfig = () => {
  return {
    apiVersion,
  };
};

export type SocialIdpSkeleton = AmConfigEntityInterface & {
  authenticationIdKey: string;
  authorizationEndpoint: string;
  clientAuthenticationMethod: string;
  clientId: string;
  clientSecret?: string | null;
  clientSecretLabelIdentifier?: string;
  enabled: boolean;
  introspectEndpoint?: string;
  issuerComparisonCheckType: string;
  jwksUriEndpoint?: string;
  jwtEncryptionAlgorithm: string;
  jwtEncryptionMethod: string;
  jwtSigningAlgorithm: string;
  pkceMethod: string;
  privateKeyJwtExpTime: number;
  redirectAfterFormPostURI?: string;
  redirectURI: string;
  responseMode: string;
  revocationCheckOptions: string[];
  scopeDelimiter: string;
  scopes: string[];
  tokenEndpoint: string;
  transform: string;
  uiConfig: Record<string, string>;
  useCustomTrustStore: boolean;
  userInfoEndpoint?: string;
};

/**
 * Get social identity provider types
 * @returns {Promise} a promise that resolves to an object containing an array of social identity provider types
 */
export async function getSocialIdentityProviderTypes({
  state,
}: {
  state: State;
}) {
  const urlString = util.format(
    getAllProviderTypesURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state)
  );
  const { data } = await generateAmApi({ resource: getApiConfig(), state }).get(
    urlString,
    {
      withCredentials: true,
    }
  );
  return data;
}

/**
 * Get social identity providers by type
 * @param {String} type social identity provider type
 * @returns {Promise} a promise that resolves to an object containing an array of social identity providers of the requested type
 */
export async function getSocialIdentityProvidersByType({
  type,
  state,
}: {
  type: string;
  state: State;
}) {
  const urlString = util.format(
    getProvidersByTypeURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state),
    type
  );
  const { data } = await generateAmApi({ resource: getApiConfig(), state }).get(
    urlString,
    {
      withCredentials: true,
    }
  );
  return data;
}

/**
 * Get all social identity providers
 * @returns {Promise<PagedResult<SocialIdpSkeleton>>} a promise that resolves to an object containing an array of social identity providers
 */
export async function getSocialIdentityProviders({
  state,
}: {
  state: State;
}): Promise<PagedResult<SocialIdpSkeleton>> {
  const urlString = util.format(
    getAllProvidersURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state)
  );
  const { data } = await generateAmApi({
    resource: getApiConfig(),
    state,
  }).post(
    urlString,
    {},
    {
      withCredentials: true,
    }
  );
  return data;
}

/**
 * Get social identity provider by type and id
 * @param {string} type social identity provider type
 * @param {string} id social identity provider id/name
 * @returns {Promise} a promise that resolves to an object containing a social identity provider
 */
export async function getProviderByTypeAndId({
  type,
  id,
  state,
}: {
  type: string;
  id: string;
  state: State;
}) {
  const urlString = util.format(
    providerByTypeAndIdURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state),
    type,
    id
  );
  const { data } = await generateAmApi({ resource: getApiConfig(), state }).get(
    urlString,
    {
      withCredentials: true,
    }
  );
  return data;
}

/**
 * Get social identity provider by type and id
 * @param {String} type social identity provider type
 * @param {String} id social identity provider id/name
 * @param {SocialIdpSkeleton} providerData a social identity provider object
 * @returns {Promise} a promise that resolves to an object containing a social identity provider
 */
export async function putProviderByTypeAndId({
  type,
  id,
  providerData,
  state,
}: {
  type: string;
  id: string;
  providerData: SocialIdpSkeleton;
  state: State;
}) {
  // If performing an update (not create), idp updates will throw an HTTP 500 error unless the redirectAfterFormPostURI attribute has a value.
  // If no redirectAfterFormPostURI is provided, importing with an empty string as its value will perform the same function without the 500 error.
  if (providerData.redirectAfterFormPostURI === undefined) {
    providerData.redirectAfterFormPostURI = '';
  }
  // until we figure out a way to use transport keys in Frodo,
  // we'll have to drop those encrypted attributes.
  const cleanData = deleteDeepByKey(providerData, '-encrypted');
  const urlString = util.format(
    providerByTypeAndIdURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state),
    type,
    id
  );
  const { data } = await generateAmApi({ resource: getApiConfig(), state }).put(
    urlString,
    cleanData,
    {
      withCredentials: true,
    }
  );
  return data;
}

/**
 * Delete social identity provider by type and id
 * @param {string} providerId provider type
 * @param {string} providerId provider id
 * @returns {Promise<unknown>} a promise that resolves to a social identity provider
 */
export async function deleteProviderByTypeAndId({
  type,
  providerId,
  state,
}: {
  type: string;
  providerId: string;
  state: State;
}) {
  const urlString = util.format(
    providerByTypeAndIdURLTemplate,
    state.getHost(),
    getCurrentRealmPath(state),
    type,
    providerId
  );
  const { data } = await generateAmApi({
    resource: getApiConfig(),
    state,
  }).delete(urlString, {
    withCredentials: true,
  });
  return data;
}
