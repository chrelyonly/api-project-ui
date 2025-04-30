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
      <template #menu="scope">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleClick(scope)">手动调用
        </el-button>
      </template>
      <template #menu-left>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.chrelyonlytask_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/strawberry/chrelyonlytask";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
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
          labelWidth: 150,
          selection: true,
          column: [
            {
              label: "标题",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },
            {
              label: "请求地址",
              prop: "requestUrl",
              rules: [{
                required: true,
                message: "请输入请求地址",
                trigger: "blur"
              }]
            },
            {
              label: "请求参数(json)",
              prop: "requestParams",
            },
            {
              label: "请求方式",
              prop: "requestMethod",
              type: "select",
              dicData: [
                { label: "GET", value: "GET" },
                { label: "POST", value: "POST" },
                { label: "PUT", value: "PUT" },
                { label: "DELETE", value: "DELETE" },
                { label: "PATCH", value: "PATCH" },
                { label: "HEAD", value: "HEAD" },
                { label: "OPTIONS", value: "OPTIONS" }
              ],
              rules: [{
                required: true,
                message: "请选择",
                trigger: "change"
              }]
            },
            {
              label: "请求类型",
              prop: "requestType",
              type: "select",
              dicData: [
                { label: "application/json", value: "application/json" },
                { label: "text/html", value: "text/html" },
                { label: "application/xml", value: "application/xml" },
                { label: "text/plain", value: "text/plain" },
                { label: "application/x-www-form-urlencoded", value: "application/x-www-form-urlencoded" },
                { label: "multipart/form-data", value: "multipart/form-data" },
                { label: "application/octet-stream", value: "application/octet-stream" }
              ],
              rules: [{
                required: true,
                message: "请选择",
                trigger: "change"
              }]
            },
            {
              label: "请求状态码",
              prop: "requestStatus",
              display: false,
            },
            {
              label: "响应内容",
              prop: "responseContent",
              display: false,
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
          addBtn: this.validData(this.permission.chrelyonlytask_add, false),
          viewBtn: this.validData(this.permission.chrelyonlytask_view, false),
          delBtn: this.validData(this.permission.chrelyonlytask_delete, false),
          editBtn: this.validData(this.permission.chrelyonlytask_edit, false)
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
      rowSave(row, done, loading) {
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
      // 手动点击一次
      handleClick(item){
        let params = {
          id: item.row.id
        }
        $https("/wechat-bot/my-task/send","get",params,1,{}).then( res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
      },
      Delete() {
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
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
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
