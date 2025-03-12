const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
	name: 'Coach',
	tableName: 'COACH',
	columns: {
		id: {
			primary: true,
			type: "uuid",
			generated: "uuid",
			nullable: false,
		},
		user_id: {
			type: "uuid",
			nullable: false,
			unique: true,
		},
		experience_years: {
			type: "integer",
			nullable: false,

		},
		description: {
			type: 'text',
			nullable: false,

		},
		profile_image_url: {
			type: 'varchar',
			length: 2048,
			nullable: false,
		},
		created_at: {
			type: 'timestamp',
			nullable: false,
			createDate: true,
		},
		updated_at: {
			type: 'timestamp',
			nullable: false,
			updateDate: true,
		}
	},
	relations: {
		User: {
			target: 'User',
			type: 'one-to-one',
			inverseSide: 'Coash',
			joinColumn: {
				name: 'user_id',
				referencedColumnName: 'id', //對應到哪一張table
				foreignKeyConstraintName: 'coach_user_id_fk'
			}
		}
	}
})
