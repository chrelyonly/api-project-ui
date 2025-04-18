import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/strawberry/chrelyonlytask/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/strawberry/chrelyonlytask/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/strawberry/chrelyonlytask/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/strawberry/chrelyonlytask/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/strawberry/chrelyonlytask/submit',
    method: 'post',
    data: row
  })
}

