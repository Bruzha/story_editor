import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface NoteAttributes {
  id?: number;
  projectId: number;
  info: any;
  markerColor: string | null;
}

export interface NoteInstance extends Model<NoteAttributes>, NoteAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface NoteModel extends ModelStatic<NoteInstance> {
  associate: (models: any) => void;
}

export const NoteFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): NoteModel => {
  const Note = sequelize.define<NoteInstance, NoteAttributes>(
    'Note',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      info: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      markerColor: {
        type: dataTypes.STRING(7),
        allowNull: true,
      },
    },
    {
      tableName: 'Notes',
    }
  ) as NoteModel;

  Note.associate = (models: any) => {
    Note.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Note;
};
