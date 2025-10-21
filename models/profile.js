import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,//gets the  _id from user model
        ref: "User",
    },
    team: {
        duo: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            default: null
        },
        squad: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            default: null
        }
    },
    tournamentsPlayed: [{
        tournament: {
            type: Schema.Types.ObjectId,
            ref: "Tournament",
        },
        br: {
            solo: {
                type: Boolean,
                default: false
            },
            duo: {
                type: Boolean,
                default: false
            },
            squad: {
                type: Boolean,
                default: false
            }

        }
    }],
    numberOfFingersUsed: {
        type: Number,
        default: 0
    },
    medals: [
        {
            tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
            medalName: { type: String, required: true },
            medalType: {
                type: String,
                enum: ['gold', 'silver', 'bronze'],
            },
        }
    ],
    teamUpRequests: [
        {
            type: Schema.Types.ObjectId,//gets the  _id from user model
            ref: "Team",
        }
    ],
},
    { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);