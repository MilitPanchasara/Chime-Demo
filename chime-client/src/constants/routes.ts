// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const awsPath = '/Prod';
export const rootPath: string = window.location.href.includes(awsPath)
  ? `${awsPath}/`
  : '/';

const routes = {
  HOME: `${rootPath}`,
  DEVICE: `${rootPath}devices`,
  MEETING: `${rootPath}meeting`,
  CUSTOMER: `${rootPath}customer`,
  STAFF: `${rootPath}staff`,
  CUSTOMERDEVICE: `${rootPath}customer-device`,
  CUSTOMERMEETING: `${rootPath}customer-meeting`
};

export default routes;
