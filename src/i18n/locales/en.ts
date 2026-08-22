export const en = {
    common: {
        loading: "Loading...",
        logout: "Log out",
    },
    features: {
        admin: {
            artist: {
                create: {
                    error: {
                        createError: "Could not create artist.",
                        invalidNameError: "The artist name is invalid.",
                    },
                    success: {
                        createSuccess: "Artist created.",
                    },
                    submit: "Create artist",
                    submitting: "Creating artist...",
                    title: "Create artist",
                },
                edit: {
                    error: {
                        editError: "Could not edit artist.",
                    },
                    success: {
                        editSuccess: "Edited artist successfully.",
                    },
                    submitEdit: "Save artist",
                    submitting: "Editing artist...",
                },
                delete: {
                    error: {
                        deleteError: "Could not delete artist.",
                    },
                    success: {
                        deleteSuccess: "Artist deleted.",
                    },
                    submitDelete: "Delete artist",
                    deleting: "Deleting artist...",
                    confirm: "Are you sure you want to delete {{name}}?",
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
            error: {
                loadError: "Could not load artists.",
            },
            message: {
                empty: "No artists found...",
                loading: "Loading artists...",
            },
            title: "Artists",
        },
        auth: {
            login: {
                error: {
                    loginError: "Could not log in. Check your email and password.",
                },
                submit: "Log in",
                submitting: "Logging in...",
                title: "Login",
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
