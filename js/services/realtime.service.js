import supabaseService from './supabase.service.js';

class RealtimeService {
    constructor() {
        this.activeChannels = new Map();
    }

    /**
     * Subscribe to table changes.
     * @param {string} table 
     * @param {string} filter 
     * @param {function} callback 
     * @returns {object} channel reference
     */
    subscribe(table, filter = null, callback) {
        const channelName = `public:${table}${filter ? ':' + filter : ''}`;
        
        if (this.activeChannels.has(channelName)) {
            return this.activeChannels.get(channelName);
        }

        const options = { event: '*', schema: 'public', table: table };
        if (filter) options.filter = filter;

        const channel = supabaseService.client.channel(channelName)
            .on('postgres_changes', options, payload => {
                callback(payload);
            })
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Subscribed to ${channelName}`);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error(`Error subscribing to ${channelName}`, err);
                }
            });

        this.activeChannels.set(channelName, channel);
        return channel;
    }

    /**
     * Unsubscribe from a channel.
     * @param {string} channelName 
     */
    unsubscribe(channelName) {
        const channel = this.activeChannels.get(channelName);
        if (channel) {
            supabaseService.client.removeChannel(channel);
            this.activeChannels.delete(channelName);
        }
    }

    /**
     * Unsubscribe all channels.
     */
    unsubscribeAll() {
        this.activeChannels.forEach((channel) => {
            supabaseService.client.removeChannel(channel);
        });
        this.activeChannels.clear();
    }
}

const realtimeService = new RealtimeService();
export default realtimeService;
