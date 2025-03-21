<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               v-model:search="search"
               v-model:page="page"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template #menu-left>
        <el-button type="danger"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.funapi_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template #requestParamsTemp-form="scope">
        <avue-crud ref="crud"
                   :option="requestParamsOption"
                   :data="scope.value"
                   @row-update="requestParamsAddUpdate"
                   @row-save="requestParamsRowSave">
        </avue-crud>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/strawberry/funapi";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        // 表单的动态列配置的
        requestParamsOption: {
          addBtn: false,
          addRowBtn: true,
          cellBtn: true,
          menuWidth: 250,
          delBtn: false,
          column: [
            {
              label: '字段名称',
              prop: 'name',
              cell: true,
              rules: [
                {
                  required: true,
                  message: "必须填写展示标题",
                  trigger: "blur",
                },
              ],
            },
            {
              label: '类型',
              prop: 'type',
              type: 'select',
              // width: 150,
              dicData: [
                {
                  label: "string",
                  value: "string"
                },
              ],
              rules: [
                {
                  required: true,
                  message: "必须选择类型",
                  trigger: "blur",
                },
              ],
              cell: true
            },
            {
              label: '描述',
              prop: 'des',
              cell: true,
            },
            {
              label: '是否必填',
              prop: 'required',
              type: 'switch',
              value: 1,
              dicData: [
                {
                  label: '可选',
                  value: 2
                },
                {
                  label: '必填',
                  value: 1
                },
              ],
              cell: true
            },
          ]
        },
        form: {
          requestParams: [],
          requestParamsTemp: [],
        },
        query: {},
        search: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "标题",
              prop: "name",
            },
            {
              label: "内容",
              prop: "content",
            },
            {
              label: "接口地址",
              prop: "apiUrl",
            },
            {
              label: "请求类型",
              prop: "requestType",
              type: "select",
              dicData: [
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
                { label: "DELETE", value: "DELETE" },
                { label: "PATCH", value: "PATCH" },
                { label: "HEAD", value: "HEAD" },
                { label: "OPTIONS", value: "OPTIONS" }
              ]
            },
            {
              label: "响应类型",
              prop: "responseType",
              type: "select",
              dicData: [
                { label: "application/json", value: "application/json" },
                { label: "text/html", value: "text/html" },
                { label: "application/xml", value: "application/xml" },
                { label: "text/plain", value: "text/plain" },
                { label: "application/x-www-form-urlencoded", value: "application/x-www-form-urlencoded" },
                { label: "multipart/form-data", value: "multipart/form-data" },
                { label: "application/octet-stream", value: "application/octet-stream" }
              ]
            },
            {
              label: "请求参数",
              prop: "requestParams",
              span: 24,
              hide: true,
              display: false,
            },
            {
              label: "请求参数",
              prop: "requestParamsTemp",
              span: 24,
              hide: true,
              display: true,
            },
            {
              label: "响应参数",
              prop: "responseBody",
              span: 24,
              hide: true,
              display: false,
            },
            {
              label: "测试案例",
              prop: "textContent",
              placeholder: "调用后返回",
            },
            {
              label: "备注",
              prop: "remark",
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.validData(this.permission.funapi_add, false),
          viewBtn: this.validData(this.permission.funapi_view, false),
          delBtn: this.validData(this.permission.funapi_delete, false),
          editBtn: this.validData(this.permission.funapi_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      // 行新增事件
      requestParamsRowSave (form, done) {
        done();
      },
      // 行编辑事件
      requestParamsAddUpdate (form, index, done, loading){
        done();
      },
      rowSave(row, done, loading) {
        row.requestParams = JSON.stringify(row.requestParamsTemp);
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        row.requestParams = JSON.stringify(row.requestParamsTemp);
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          if (type === "view"){
            this.requestParamsOption.header = false
            this.requestParamsOption.menu = false
          }else {
            this.requestParamsOption.header = true
            this.requestParamsOption.menu = true
          }
          //   判断动态列是否是数组
          if(this.form.requestParams && this.form.requestParams.length > 0){
            let requestParams = JSON.parse(this.form.requestParams)
            this.form.requestParams = requestParams
            this.form.requestParamsTemp = requestParams
          }else {
            this.form.requestParams = []
            this.form.requestParamsTemp = []
          }
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
