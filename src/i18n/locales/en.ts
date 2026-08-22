export const en = {
    common: {
        loading: "Loading...",
        logout: "Log out",
    },
    features: {
        admin: {
            artist: {
                create: {
                    title: "Create artist",
                    submit: "Create artist",
                    submitting: "Creating artist...",
                    error: {
                        createError: "Could not create artist.",
                        invalidNameError: "The artist name is invalid.",
                    },
                    success: {
                        createSuccess: "Artist created.",
                    },
                },
                edit: {
                    title: "Edit artist",
                    submitEdit: "Save artist",
                    submitting: "Editing artist...",
                    error: {
                        editError: "Could not edit artist.",
                    },
                    success: {
                        editSuccess: "Edited artist successfully.",
                    },
                },
                delete: {
                    title: "Delete artist",
                    submitDelete: "Delete artist",
                    deleting: "Deleting artist...",
                    confirm: "Are you sure you want to delete {{name}}?",
                    error: {
                        deleteError: "Could not delete artist.",
                    },
                    success: {
                        deleteSuccess: "Artist deleted.",
                    },
                },
                title: "Artist",
                recordsTitle: "Records",
                error: {
                    loadError: "Could not load artist.",
                    loadRecordsError: "Could not load artist records.",
                },
                message: {
                    empty: "No artist found...",
                    loading: "Loading artist...",
                    recordsEmpty: "No records found...",
                },
            },
            artists: {
                lead: "Here, you can administer the artists.",
                title: "Artists",
            },
        },
        artist: {
            error: {
                loadError: "Could not load artist.",
            },
            message: {
                empty: "No artist found...",
                loading: "Loading artist...",
            }
        },
        artists: {
            title: "Artists",
            error: {
                loadError: "Could not load artists.",
            },
            message: {
                empty: "No artists found...",
                loading: "Loading artists...",
            },
        },
        auth: {
            login: {
                title: "Login",
                submit: "Log in",
                submitting: "Logging in...",
                error: {
                    loginError: "Could not log in. Check your email and password.",
                },
            },
        },
    },
    forms: {
        description: "Description",
        email: "E-mail",
        name: "Name",
        password: "Password",
    },
    navigation: {
        admin: "Admin",
        adminArtists: "Admin artists",
        artists: "Artists",
        home: "TBF home",
        login: "Login",
    },
};
