import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/strawberry/funapi/list',
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
    url: '/strawberry/funapi/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/strawberry/funapi/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/strawberry/funapi/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/strawberry/funapi/submit',
    method: 'post',
    data: row
  })
}

