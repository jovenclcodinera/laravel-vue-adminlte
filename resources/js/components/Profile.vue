<style>
    .widget-user-header {
        background: url('https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940') center center;
        background-size: cover;
        min-height: 250px;
    }
</style>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mt-3">
                <!-- Widget: user widget style 1 -->
                <div class="card card-widget widget-user">
                    <!-- Add the bg color to the header using any of the bg-* classes -->
                    <div class="widget-user-header text-white">
                        <h3 class="widget-user-username text-right">{{form.name}}</h3>
                        <h5 class="widget-user-desc text-right">{{form.type}}</h5>
                    </div>
                    <div class="widget-user-image" style="margin-top: 100px">
                        <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">3,200</h5>
                                    <span class="description-text">SALES</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4 border-right">
                                <div class="description-block">
                                    <h5 class="description-header">13,000</h5>
                                    <span class="description-text">FOLLOWERS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                            <div class="col-sm-4">
                                <div class="description-block">
                                    <h5 class="description-header">35</h5>
                                    <span class="description-text">PRODUCTS</span>
                                </div>
                                <!-- /.description-block -->
                            </div>
                            <!-- /.col -->
                        </div>
                        <!-- /.row -->
                    </div>
                </div>
                <!-- /.widget-user -->
            </div>
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a></li>
                            <li class="nav-item"><a class="nav-link active show" href="#settings" data-toggle="tab">Settings</a></li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <!-- Activity Tab -->
                            <div class="tab-pane" id="activity">
                                <h3 class="text-center">Display User Activity</h3>
                            </div>
                            <!-- Setting Tab -->
                            <div class="tab-pane active show" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="name">Name:</label>
                                        <input type="text" name="name" class="form-control" id="name" v-model="form.name"
                                               :class="{ 'is-invalid': form.errors.has('name')}">
                                        <has-error :form="form" field="name"></has-error>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email:</label>
                                        <input type="email" name="email" class="form-control" id="email" v-model="form.email"
                                               :class="{ 'is-invalid': form.errors.has('email')}">
                                        <has-error :form="form" field="email"></has-error>
                                    </div>
                                    <div class="form-group">
                                        <label for="bio">About:</label>
                                        <textarea name="bio" id="bio" class="form-control" v-model="form.bio"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="photo" class="d-block">Profile Photo</label>
                                        <input type="file" name="photo" id="photo" @change="updateProfile">
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Password (leave empty if not changing):</label>
                                        <input type="password" name="password" class="form-control" id="password"
                                               v-model="form.password" :class="{ 'is-invalid': form.errors.has('password')}">
                                        <has-error :form="form" field="password"></has-error>
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-success bg-gradient-success" @click.prevent="updateInfo">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from "vform/src/Form";

    export default {
        data() {
            return {
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                }),
                photoPath: ""
            }
        },
        mounted() {
            console.log('Component mounted.');
        },
        created() {
            axios.get("api/profile")
                .then(({data}) => {
                    (this.form.fill(data));
                    this.photoPath = "img/profile/" + data.photo;
                });
        },
        methods : {
            updateProfile(e) {
                let file = e.target.files[0];
                // console.log(file);
                let reader = new FileReader();
                if (file["size"] < 2097152) {
                    reader.onloadend = () => {
                        // console.log("RESULT", reader.result);
                        this.form.photo = reader.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Image should not exceed at least 2MB'
                    })
                }
            },
            updateInfo() {
                this.$Progress.start();
                this.form.put("api/profile/")
                    .then(() => {
                        this.$Progress.finish();
                        toast.fire({
                            icon: 'success',
                            title: 'Profile updated successfully'
                        });
                        axios.get("api/profile")
                            .then(({data}) => {
                                (this.form.fill(data));
                                this.photoPath = "img/profile/" + data.photo;
                            });
                    })
                    .catch(() => {
                        this.$Progress.fail();
                        toast.fire({
                            icon: 'warning',
                            title: 'An error occurred. Profile was not updated'
                        });
                    });
            },
            getProfilePhoto () {
                return this.photoPath;
            }
        }
    }
</script>
