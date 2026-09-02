export const en = {
    common: {
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        loading: "Loading...",
        logout: "Log out",
    },
    features: {
        admin: {
            artist: {
                title: "Artist",
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
                error: {
                    loadError: "Could not load artist.",
                    loadRecordsError: "Could not load artist records.",
                },
                message: {
                    empty: "No artist found...",
                    loading: "Loading artist...",
                    recordsEmpty: "No records found...",
                },
                recordsTitle: "Records",
                createRecord: {
                    title: "Add record",
                    submit: "Create record",
                    submitting: "Creating record...",
                    error: {
                        createError: "Could not create record.",
                        invalidNameError: "The record name is invalid.",
                        invalidYearError: "The year must be a valid number.",
                    },
                    success: {
                        createSuccess: "Record created.",
                    },
                },
                editRecord: {
                    title: "Edit record",
                    submit: "Save record",
                    submitting: "Saving record...",
                    error: {
                        editError: "Could not update record.",
                        invalidNameError: "The record name is invalid.",
                        invalidYearError: "The year must be a valid number.",
                    },
                    success: {
                        editSuccess: "Record updated.",
                    },
                },
                deleteRecord: {
                    confirm: "Are you sure you want to delete {{name}}?",
                    deleting: "Deleting record...",
                    error: {
                        deleteError: "Could not delete record.",
                    },
                    success: {
                        deleteSuccess: "Record deleted.",
                    },
                },
            },
            artists: {
                lead: "Here, you can administer the artists.",
                title: "Artists",
            },
            records: {
                title: "Records",
                lead: "Here, you can administer all records across artists.",
                create: {
                    title: "Create record",
                    submit: "Create record",
                    submitting: "Creating record...",
                    artistsLabel: "Associated artists",
                    noArtistsHint: "No artists selected (compilation / various artists)",
                    error: {
                        createError: "Could not create record.",
                        invalidNameError: "The record name is invalid.",
                        invalidYearError: "The year must be a valid number.",
                    },
                    success: {
                        createSuccess: "Record created successfully.",
                    },
                },
                error: {
                    loadError: "Could not load records.",
                },
                message: {
                    empty: "No records found...",
                    loading: "Loading records...",
                    noArtists: "Various Artists / Compilation",
                },
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
        year: "Year",
    },
    navigation: {
        admin: "Admin",
        adminArtists: "Admin artists",
        adminRecords: "Admin records",
        artists: "Artists",
        home: "TBF home",
        login: "Login",
    },
};
