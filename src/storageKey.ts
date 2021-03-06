/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

/** Keys used in AsyncStorage */
enum StorageKey {
    /** The WHS Calendar caches */
    Calendar = "@whs.js/calendar",
    /** The Users Classes */
    Classes = "@whs.js/classes",
    /** The Prepared Classes */
    PreparedClasses = "@whs.js/classes-prepared",
    /** The user's preferences */
    Preferences = "@whs.js/preferences",
    /** The saved navigation state */
    Navigation = "@whs.js/navigation"
}

export default StorageKey;