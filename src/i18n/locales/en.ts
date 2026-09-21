export const en = {
    common: {
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        loading: "Loading...",
        logout: "Log out",
        save: "Save",
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
                deleteRecord: {
                    confirm: "Are you sure you want to delete {{name}}?",
                    deleting: "Deleting record...",
                    error: {
                        deleteError: "Could not delete record {{name}}.",
                    },
                    success: {
                        deleteSuccess: "The record {{name}} was deleted.",
                    },
                },
            },
            artists: {
                lead: "Here, you can administer the artists.",
                search: "Search artists...",
                title: "Artists",
                list: {
                    title: "List of artists",
                },
            },
            record: {
                title: "Record",
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
                edit: {
                    submit: "Save record",
                    submitting: "Saving record...",
                    error: {
                        editError: "Could not update record.",
                        invalidNameError: "The record name is invalid.",
                        invalidYearError: "The year must be a valid number.",
                    },
                    success: {
                        editSuccess: "Record updated successfully.",
                    },
                },
            },
            records: {
                title: "Records",
                lead: "Here, you can administer all records across artists.",
                search: "Search records...",
                error: {
                    loadError: "Could not load records.",
                },
                list: {
                    title: "List of records",
                },
                message: {
                    empty: "No records found...",
                    loading: "Loading records...",
                    noArtists: "Various Artists / Compilation",
                },
            },
            songs: {
                title: "Songs",
                songList: "Song list",
                addSong: "Add song",
                submitting: "Saving song...",
                noSongs: "No songs added yet.",
                loadError: "Could not load song list.",
                createError: "Could not add song.",
                createSuccess: "Song added.",
                editError: "Could not update song.",
                editSuccess: "Song updated.",
                deleteConfirm: "Are you sure you want to delete {{name}}?",
                deleteError: "Could not delete song.",
                deleteSuccess: "Song deleted.",
                invalidNameError: "The song title is required.",
                invalidTrackError: "Track number must be a valid number.",
            },
        },
        artist: {
            error: {
                loadError: "Could not load artist.",
            },
            message: {
                empty: "No artist found...",
                loading: "Loading artist...",
                noBiography: "No biography available.",
                recordsEmpty: "No records were found for this artist.",
            },
            loginPrompt: {
                description: "You must be logged in to view discography, song lists, and listen to songs.",
                submit: "Log in to view albums and songs",
                title: "Do you want to listen to the music?",
            },
            recordsTitle: "Releases & music",
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
        records: {
            title: "Records",
        },
        songs: {
            title: "Songs",
        },
    },
    forms: {
        description: "Description",
        email: "E-mail",
        format: "Format",
        selectFormatPlaceholder: "-- Select format --",
        formats: {
            cassette: "Cassette",
            cd: "CD",
            cdr: "CD-R",
            digital: "Digital",
            "vinyl-12": '12" Vinyl',
            "vinyl-7": '7" Vinyl',
        },
        name: "Name",
        password: "Password",
        trackNumber: "Track #",
        type: "Type",
        selectTypePlaceholder: "-- Select type --",
        types: {
            album: "Album",
            compilation: "Compilation",
            ep: "EP",
            single: "Single",
            split: "Split",
        },
        year: "Year",
        yearPlaceholder: "YYYY",
    },
    navigation: {
        admin: "Admin",
        adminArtists: "Admin artists",
        adminRecords: "Admin records",
        artists: "Artists",
        home: "TBF home",
        login: "Login",
        records: "Records",
        songs: "Songs",
    },
} as const;
