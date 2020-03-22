<template>
    <div class="container">
        <div class="row mt-5" v-if="$gate.isAdminOrAuthor()">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-gradient-gray-dark">
                        <h3 class="card-title pt-2">Users List</h3>
                        <div class="card-tools">
                            <button class="btn btn-success btn-sm mt-2" @click="newModal">
                                <i class="fas fa-user-plus"></i>
                                New User
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Creation Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users.data" :key="user.id">
                                    <td>{{user.id}}</td>
                                    <td>{{user.name}}</td>
                                    <td>{{user.email}}</td>
                                    <td>{{user.type | upText}}</td>
                                    <td>{{user.created_at | dateDisplay}}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="editModal(user)">
                                            <i class="fas fa-user-edit"></i>
                                        </button>
                                        |
                                        <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <pagination :data="users" @pagination-change-page="getResults"></pagination>
                    </div>
                </div>
                <!-- /.card -->
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="formModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-primary">
                        <h5 class="modal-title" id="formModal">{{actionMode === "CREATE" ? "Add User" : "Edit User"}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="actionMode === 'CREATE' ? createUser() : editUser()">
                        <div class="modal-body">
                            <div class="form-group">
                                <input v-model="form.name" type="text" name="name" placeholder="Name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <input v-model="form.email" type="email" name="email" placeholder="Email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <textarea v-model="form.bio" name="bio" placeholder="Short bio for user (optional)" id="bio"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }">
                                </textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                            <div class="form-group">
                                <select name="type" id="type" v-model="form.type" class="form-control"
                                        :class="{ 'is-invalid': form.errors.has('type') }">
                                    <option value="">Select User role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="type"></has-error>
                            </div>
                            <div class="form-group">
                                <input type="password" v-model="form.password" name="password" id="password" class="form-control"
                                       :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-success" v-show="actionMode === 'CREATE'">Create</button>
                            <button type="submit" class="btn btn-warning" v-show="actionMode === 'EDIT'">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from "vform/src/Form";

    export default {
        data () {
            return {
                users : {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                }),
                actionMode: ""
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods: {
            editUser() {
                this.$Progress.start();
                this.form.put("api/user/" + this.form.id)
                    .then(() => {
                        $('#userModal').modal("hide");
                        toast.fire({
                            icon: 'success',
                            title: 'User updated successfully'
                        });
                        this.$Progress.finish();
                        Fire.$emit("afterCreateEvent");
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    });
            },
            newModal() {
                this.actionMode = "CREATE";
                this.form.reset();
                this.form.clear();
                $('#userModal').modal("show");
            },
            editModal(user) {
                this.actionMode = "EDIT";
                this.form.reset();
                this.form.clear();
                $('#userModal').modal("show");
                this.form.fill(user);
            },
            createUser() {
                this.$Progress.start();
                this.form.post("api/user")
                    .then(() => {
                        $('#userModal').modal("hide");
                        toast.fire({
                            icon: 'success',
                            title: 'User created successfully'
                        });
                        this.$Progress.finish();
                        Fire.$emit("afterCreateEvent");
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    });
            },
            loadUsers() {
                if (this.$gate.isAdminOrAuthor()) {
                    axios.get("api/user")
                        .then(({data}) => {
                            this.users = data;
                        });
                } else {
                    location.replace("/not-found");
                }
            },
            deleteUser(id) {
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.value) {
                        this.$Progress.start();
                        // Send request to server
                        this.form.delete("api/user/" + id)
                            .then(() => {
                                this.loadUsers();
                                swal.fire(
                                    'Deleted!',
                                    'User has been deleted.',
                                    'success'
                                );
                                this.$Progress.finish();
                            })
                            .catch(() => {
                                this.$Progress.fail();
                                swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'An error has occurred!'
                                })
                            })
                    }
                })
            },
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            }
        },
        created() {
            Fire.$on("searching", () => {
                let query = this.$parent.search;
                axios.get("api/findUser?search=" + query)
                    .then((data) => {
                        this.users = data.data;
                    })
                    .catch(() => {
                        swal.fire({
                            icon: 'error',
                            title: 'Not Found',
                            text: 'Sorry. What you are looking for is not found.'
                        })
                    });
            });
            this.loadUsers();
            Fire.$on("afterCreateEvent", () => {
                this.loadUsers();
            })
        }
    }
</script>
