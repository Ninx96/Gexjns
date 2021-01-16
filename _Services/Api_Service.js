import React from 'react';

export function getData(url, param) {
  return new Promise((resolve, reject) => {
    fetch(`https://musicstore.quickgst.in/api/GexStock/${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postData(url, param) {
  return new Promise((resolve, reject) => {
    fetch(`https://musicstore.quickgst.in/api/${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function checkOtp(mobile, otp) {
  return new Promise((resolve, reject) => {
    fetch(`https://musicstore.quickgst.in/Auth/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'userName=' + mobile + '&password=' + otp + '&grant_type=password',
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function checkMobile(param) {
  return new Promise((resolve, reject) => {
    fetch(`https://musicstore.quickgst.in/api/StockLogin/PostStockLogin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
